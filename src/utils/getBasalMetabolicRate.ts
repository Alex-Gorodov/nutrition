import { Genders } from "../const";
import { User } from "../types/user";

export function getBasalMetabolicRate(user: User): Number {
  if (user.gender === Genders.Male) {
    return Math.floor(66 + (13.7 * user.weight) + (5 * user.height) - (6.8 * user.age));
  } else if (user.gender === Genders.Female) {
    return Math.floor(665 + (9.6 * user.weight) + (1.8 * user.height) - (4.7 * user.age));
  } else return 0
}
