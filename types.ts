import Database from "./database";

type Unique<T, UniqueTypeName> = T & { __TYPE__: UniqueTypeName };

/**
 * Base ID type. Eight characters long, alphanumeric.
 */
type ID = string;

/**
 * The ID of a user in the database.
 */
export type UserID = Unique<ID, "UserID">;

/**
 * The ID of an excersize-entry in the database.
 */
export type EntryID = Unique<ID, "EntryID">;

/**
 * Excersizes that can be logged.
 */
export type TExcersize = "Seated Leg Press - Legs" | "Hip Adduction - Legs" | "Hip Abduction - Legs" | "Glute - Legs" | "Leg Curl - Legs" | "Calf Extension - Legs" | "Seated Leg Curl - Legs" | "Leg Extension - Legs"
												| "Abdominal - Core" | "Abdominal Crunch - Core" | "Torso Rotation - Core" | "Core Ball - Core" | "Tricep Pushdown - Arms" | "Low Row - Arms" | "Cable - Arms" | "Lat Pulldown - Arms" | "Dual Pulley Pulldown - Arms" | "Dual Pulley Row - Arms" | "RDL - Back" | "Seated Calf - Back"
												| "ISOL Row - Chest" | "Shoulder Press - Shoulders" | "ISOL Shoulder Press - Shoulders" | "Chest Press - Chest" | "ISOL Wide Chest - Chest" | "Seated Two Arm Curl - Arms" | "Seated Concentration Curl - Arms" | "Standing One Arm Curl - Arms" | "Standing Two Arm Curl Facing Out - Arms" | "Seated Shoulder Press - Shoulders"
												| "Seated One Arm Shoulder - Shoulders" | "Seated Two Arm Shoulder Press Off Back Pad - Shoulders" | "Standing One Arm Shoulder Press - Shoulders" | "Non-Pulley Chest Press - Chest" | "Seated Incline-Decline Combination Press - Chest" | "Seated Fly - Arms" | "Seated One Arm Press Off Back Pad - Arms" | "Standing One Arm Press With Rotation - Arms"
												| "Knee Flexion - Legs" | "Hip Extension - Legs" | "Knee Flexion Hip Extension - Legs" | "Cycling Motion - Legs" | "Forward Step - Legs" | "Side Step - Legs" | "Step With Arm Curl - Arms" | "Step With Shoulder Press - Shoulders" | "Straight Leg Calf Press - Legs" | "Bent Knee Press - Legs" | "Basic Squat - Legs"
												| "Squat With Hips Off Back Pad - Legs" | "Split Stance Squat - Legs" | "Squat With One Leg Only - Legs" | "ISOL High Row - Back" | "ISOL Incline Press - Chest" | "ISOL Shoulder Press - Shoulders"
												| "Triceps Press - Arms" | "Back Extension - Back" | "Fixed Pulldown - Arms" | "Seated Row - Back" | "Pectoral Fly - Chest" | "Rear Deltoid - Shoulders" | "Assisted Dip - Arms" | "Biceps Curl - Arms" | "Biceps Extension - Arms" | "Push Ups - Arms" | "Pull Ups - Arms" | "Plank - Core" | "Bench Press - Arms"
												| "Dumbbell Bicep Curl - Arms" | "Dumbbell Behind Head - Arms" | "Dumbbells Lift - Arms" | "Sit Ups - Core" | "Curl Ups - Core" | "Treadmill - Cardio" | "Stair Climb - Cardio" | "Ladder Climb - Cardio" | "Stationary Bike - Cardio";

/**
 * List of excersizes from the TExcersize type for use in the frontend
 */
export const Excersizes = ["Seated Leg Press - Legs", "Hip Adduction - Legs", "Hip Abduction - Legs", "Glute - Legs", "Leg Curl - Legs", "Calf Extension - Legs", "Seated Leg Curl - Legs", "Leg Extension - Legs",
													 "Abdominal - Core", "Abdominal Crunch - Core", "Torso Rotation - Core", "Core Ball - Core", "Tricep Pushdown - Arms", "Low Row - Arms", "Cable - Arms", "Lat Pulldown - Arms", "Dual Pulley Pulldown - Arms", "Dual Pulley Row - Arms", "RDL - Back", "Seated Calf - Back",
													 "ISOL Row - Chest", "Shoulder Press - Shoulders", "ISOL Shoulder Press - Shoulders", "Chest Press - Chest", "ISOL Wide Chest - Chest", "Seated Two Arm Curl - Arms", "Seated Concentration Curl - Arms", "Standing One Arm Curl - Arms", "Standing Two Arm Curl Facing Out - Arms", "Seated Shoulder Press - Shoulders",
													 "Seated One Arm Shoulder - Shoulders", "Seated Two Arm Shoulder Press Off Back Pad - Shoulders", "Standing One Arm Shoulder Press - Shoulders", "Non-Pulley Chest Press - Chest", "Seated Incline-Decline Combination Press - Chest", "Seated Fly - Arms", "Seated One Arm Press Off Back Pad - Arms", "Standing One Arm Press With Rotation - Arms",
													 "Knee Flexion - Legs", "Hip Extension - Legs", "Knee Flexion Hip Extension - Legs", "Cycling Motion - Legs", "Forward Step - Legs", "Side Step - Legs", "Step With Arm Curl - Arms", "Step With Shoulder Press - Shoulders", "Straight Leg Calf Press - Legs", "Bent Knee Press - Legs", "Basic Squat - Legs",
													 "Squat With Hips Off Back Pad - Legs", "Split Stance Squat - Legs", "Squat With One Leg Only - Legs", "ISOL High Row - Back", "ISOL Incline Press - Chest", "ISOL Shoulder Press - Shoulders",
													 "Triceps Press - Arms", "Back Extension - Back", "Fixed Pulldown - Arms", "Seated Row - Back", "Pectoral Fly - Chest", "Rear Deltoid - Shoulders", "Assisted Dip - Arms", "Biceps Curl - Arms", "Biceps Extension - Arms", "Push Ups - Arms", "Pull Ups - Arms", "Plank - Core", "Bench Press - Arms",
													 "Dumbbell Bicep Curl - Arms", "Dumbbell Behind Head - Arms", "Dumbbells Lift - Arms", "Sit Ups - Core", "Curl Ups - Core", "Treadmill - Cardio", "Stair Climb - Cardio", "Ladder Climb - Cardio", "Stationary Bike - Cardio"];
Excersizes.sort();

/**
 * The date in milliseconds since the Unix epoch.
 */
export type DateInMS = number;

const ID_LENGTH = 8;
const ID_REGEX = /^[A-Za-z0-9]{8}$/;
const ID_chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

/**
 * Generate a random ID of length ID_LENGTH without checking to see if it already exists first.
 * @returns a random ID of length ID_LENGTH
 */
function _gen_ID(): ID {
	let id_string = "";
	
	for (let i = 0; i < ID_LENGTH; i++) {
		id_string += ID_chars.charAt(Math.floor(Math.random() * ID_chars.length));
	}
	
	return id_string;
}

/**
 * Make a new ID that does not already exist.
 */
export async function MakeID(): Promise<ID> {
	while (true) {
		const id: ID = _gen_ID();
		if (!(await Database.IDAvailable(id))) continue;
		return id;
	}
}

/**
 * Check if the given <id> matches the ID_REGEX.
 */
export function ValidateID(id: string): boolean {
	return ID_REGEX.test(id);
}