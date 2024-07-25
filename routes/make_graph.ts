import Database from "../database";
import { IEntry, IEntryCollection } from "../database-types";
import format_date from "../format_date";
import { EntryID, TExcersize, UserID } from "../types";
import Validate from "../validate";
const QuickChart = require('quickchart-js');

const WEIGHT_DISABLED_EXCERSIZES = ["Plank - Core", "Sit Ups - Core", "Curl Ups - Core", "Push Ups - Arms", "Pull Ups - Arms", "Core Ball - Core"];
/**
{
  label: 'Comparison',
  data: entries.map((entry: IEntry) => entry.comparison),
  borderColor: 'rgb(255, 205, 86)',
  backgroundColor: 'rgba(255, 205, 86, 0.5)',
  fill: false,
  hidden: !includeComparison
}
 */
// includeComparison will always be false (updated to disable comparison feature 7/25/2024)
async function make_graph_url(user_id: UserID, excersize: TExcersize, entries: Array<IEntry>, includeReps: boolean, includeWeight: boolean, includeWeightSum: boolean, includeComparison: boolean, width: number, height: number): Promise<string> {
  const chart = new QuickChart();
  const config = {
    type: 'line',
    width,
    height,
    options: {
      title: {
        display: true,
        text: excersize
      },
      legend: {
        display: true,
        position: 'left',
        align: 'start'
      },
      scales: {
        yAxes: [
          {
            id: 'y-axis-1',
            type: 'linear',
            position: 'left',
            scaleLabel: {
              display: true,
              labelString: 'Reps'
            },
            ticks: {
              beginAtZero: true
            }
          },
          {
            id: 'y-axis-2',
            type: 'linear',
            position: 'right',
            scaleLabel: {
              display: true,
              labelString: 'Weight'
            },
            ticks: {
              beginAtZero: true
            },
            gridLines: {
              drawOnChartArea: false,
            }
          },
          {
            id: 'y-axis-3',
            type: 'linear',
            position: 'right',
            scaleLabel: {
              display: true,
              labelString: 'Weight Sum'
            },
            ticks: {
              beginAtZero: true
            },
            gridLines: {
              drawOnChartArea: false,
            }
          },
        ]
      }
    },
    data: {
      labels: entries.map((entry: IEntry) => format_date(entry.date)),
      datasets: [
        {
          label: 'Reps',
          // steppedLine: true,
          data: entries.map((entry: IEntry) => entry.reps),
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          fill: false,
          yAxisID: 'y-axis-1',
          hidden: !includeReps
        },
        {
          label: 'Weight',
          // steppedLine: true,
          data: entries.map((entry: IEntry) => entry.weight_per_rep),
          borderColor: 'rgb(54, 162, 235)',
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          fill: false,
          yAxisID: 'y-axis-2',
          hidden: !includeWeight
        },
        {
          label: 'Weight Sum',
          // steppedLine: true,
          data: entries.map((entry: IEntry) => entry.weight_sum),
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          fill: false,
          yAxisID: 'y-axis-3',
          hidden: !includeWeightSum
        }
      ]
    }
  };

  // If the excersize is a cardio excersize, change to cardio labels and hide the weight sum
  if (excersize.split(" - ")[1] === "Cardio") {
    // Change the legend/key labels
    config.data.datasets[0].label = 'Duration';
    config.data.datasets[1].label = 'Distance';
    config.data.datasets[2].hidden = true;
    
    // Change the y-axis labels
    config.options.scales.yAxes[0].scaleLabel.labelString = 'Duration';
    config.options.scales.yAxes[1].scaleLabel.labelString = 'Distance';
  }

  // If the excersize is a weight disabled excersize, like core ball, hide the weight and weight sum, as only reps are needed
  if (WEIGHT_DISABLED_EXCERSIZES.includes(excersize)) {
    config.data.datasets[1].hidden = true;
    config.data.datasets[2].hidden = true;
  }

  // If the weight y-axis is not needed, remove it
  if (!includeWeight) {
    config.options.scales.yAxes = config.options.scales.yAxes.filter((axis: any) => axis.id !== 'y-axis-2');
    config.data.datasets[1].yAxisID = 'y-axis-1'; // it won't be shown anyway, but this needs to be fixed or it will throw an error
  }

  // If the weight sum y-axis is not needed, remove it
  if (!includeWeightSum) {
    config.options.scales.yAxes = config.options.scales.yAxes.filter((axis: any) => axis.id !== 'y-axis-3');
    config.data.datasets[2].yAxisID = 'y-axis-1'; // it won't be shown anyway, but this needs to be fixed or it will throw an error
  }

  chart.setConfig(config)
  return chart.getUrl();
}

export default function make_graph(req: any, res: any): void {
  const user_id = req.params?.user_id;
  const excersize = req.params?.excersize;
  const includeReps = req.body?.includeReps;
  const includeWeight = req.body?.includeWeight;
  const includeWeightSum = req.body?.includeWeightSum;
  const width = req.body?.width;
  const height = req.body?.height;

  if (Validate(user_id, "user_id", res)) return;
  if (Validate(excersize, "excersize", res)) return;
  if (Validate(includeReps, "includeReps", res)) return;
  if (Validate(includeWeight, "includeWeight", res)) return;
  if (Validate(includeWeightSum, "includeWeightSum", res)) return;
  if (Validate(width, "width", res)) return;
  if (Validate(height, "height", res)) return;

  const user = Database.GetUser(user_id);
	if (user === null) return res.status(400).send({ error: `User with user_id "${user_id}" does not exist.` });

  Database.GetEntryCollection(user_id, excersize).then((entry_collection: IEntryCollection) => {
    if (!entry_collection) {
      return res.status(400).send({ error: `No entry collection exists for excersize "${excersize}" for user with user_id "${user_id}"` });
    }

    const entry_ids: Array<EntryID> = entry_collection.entries;
    Database.GetEntriesWithIDs(entry_ids).then(async (entries: Array<IEntry>) => {
      return res.send({ graph_url: await make_graph_url(user_id, excersize, entries, includeReps, includeWeight, includeWeightSum, false, width, height) });
    });
  });
}