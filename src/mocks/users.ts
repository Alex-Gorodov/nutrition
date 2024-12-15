import { User } from "../types/user";
import { Genders, TrainingType } from "../const";
import { MealType } from "../const";
import { NutritionTarget } from "../const";

export const users: User[] = [
  {
    activityLevel: 1.725,
    age: 31,
    avatar: '',
    email: "gorodov1993@gmail.com",
    gender: Genders.Male,
    height: 170,
    id: "HS3NUcTjaqZi2vycLud08HmXZTX2",
    isAdmin: false,
    mealSchedule: [
      [
        {
          calories: 284,
          carbs: 35,
          fats: 7,
          id: "breakfast-2",
          ingredients: [
            "овсянка",
            "коттедж",
            "огурцы"
          ],
          name: "овсянка с коттеджем",
          picture: "",
          proteins: 17,
          recipe: "4 ложки овсянки залить кипятком, 100 грамм коттеджа и 2 средних огурца",
          type: MealType.Breakfast
        },
        new Date("2024-12-08T05:13:29.255Z")
      ],
      [
        {
          calories: 220,
          carbs: 2,
          fats: 0,
          id: "snack-1",
          ingredients: [
            "протеиновый батончик"
          ],
          name: "Протеиновый батончик",
          picture: "",
          proteins: 24,
          recipe: "",
          type: MealType.Snack
        },
        new Date("2024-12-09T14:56:54.677Z")
      ],
      [
        {
          calories: 220,
          carbs: 2,
          fats: 0,
          id: "snack-1",
          ingredients: [
            "протеиновый батончик"
          ],
          name: "Протеиновый батончик",
          picture: "",
          proteins: 24,
          recipe: "",
          type: MealType.Snack
        },
        new Date("2024-12-09T14:57:25.844Z")
      ],
      [
        {
          calories: 350,
          carbs: 45,
          fats: 14,
          id: "breakfast-0",
          ingredients: [
            "4 ложки овсянки",
            "2 яйца",
            "семена чиа",
            "малина или другия ягоды"
          ],
          name: "Овсянка с яйцами",
          proteins: 17,
          type: MealType.Breakfast
        },
        new Date("2024-12-10T05:10:53.868Z")
      ],
      [
        {
          calories: 300,
          carbs: 18,
          fats: 13,
          id: "lunch-1",
          ingredients: [
            "1 куриное бедро",
            " 1 помидор",
            " 4 шампиньона",
            " 1 морковь",
            " 1/2 болгарского перца",
            " 1/2 лука",
            " 1 цуккини или кабачок",
            " специи"
          ],
          name: "Курица с овощами",
          picture: "",
          proteins: 28,
          recipe: "1. Разогрейте духовку до 200°C.   2. Подготовьте овощи: нарежьте помидор, грибы, морковь, сладкий перец, лук и кабачок (или патиссон).   3. Приправьте курицу: натрите куриное бедро оливковым маслом (если используете) и приправьте специями на ваш выбор — солью, перцем, паприкой, чесночным порошком и сушеными травами, такими как тимьян или орегано.   4. Выложите овощи: на противень распределите нарезанные овощи (помидор, грибы, морковь, сладкий перец, лук и кабачок) в один слой.   5. Добавьте курицу: положите приправленное куриное бедро поверх овощей.   6. Запекайте: поставьте противень в разогретую духовку и запекайте примерно 35–45 минут, пока курица полностью не приготовится (внутренняя температура должна достигнуть 75°C), а овощи не станут мягкими.   7. Подавайте: достаньте из духовки, дайте блюду немного остыть и подавайте горячим.  ",
          type: MealType.Lunch
        },
        new Date("2024-12-10T13:15:13.036Z")
      ]
    ],
    name: "Город",
    target: NutritionTarget.WeightLoss,
    token: "eyJhbGciOiJSUzI1NiIsImtpZCI6IjNmZDA3MmRmYTM4MDU2NzlmMTZmZTQxNzM4YzJhM2FkM2Y5MGIyMTQiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vbnV0cml0aW9uLTJjZGE3IiwiYXVkIjoibnV0cml0aW9uLTJjZGE3IiwiYXV0aF90aW1lIjoxNzMyOTU4ODgyLCJ1c2VyX2lkIjoiSFMzTlVjVGphcVppMnZ5Y0x1ZDA4SG1YWlRYMiIsInN1YiI6IkhTM05VY1RqYXFaaTJ2eWNMdWQwOEhtWFpUWDIiLCJpYXQiOjE3MzI5NTg4ODIsImV4cCI6MTczMjk2MjQ4MiwiZW1haWwiOiJnb3JvZG92MTk5M0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsiZ29yb2RvdjE5OTNAZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoicGFzc3dvcmQifX0.Ls0ImqDddBNwholvsrLB6rnfvmAiARYRIqG3yE322cS9IVTERlV5-Y2rKKZPrYt2L1tXw2lATBmbxKmqr_slLnQpBJ41iPyd2rq-ZEq3K7eat4TH0mZgFG9aXeaV2IhR--SpSvaDzhuH_3k0vVnjA1WtjiHI7spEu93xedMYPJzvQQKHam06f6ec5qZaRg9kpXf8SJ6k8meLGe2aq9cJBuhKgMyj3RlqsgdBo5Dbq0xQhZAJO0JXElgGKet0oDCgRgkN2c6zEYZT_vMoOEazaswsqKdEfUYsRL-5afWtcC1_w4YGKedrFX6TVGCwVbROhb9eAe56zCyIZuSzY6571g",
    "trainingSessions": [
      {
        activity: TrainingType.Walking,
        caloriesBurned: 420,
        date: new Date("2024-12-07T04:40:14.414Z"),
        duration: 70
      },
      {
        activity: TrainingType.Walking,
        caloriesBurned: 514.395,
        date: new Date("2024-12-08T16:43:04.132Z"),
        duration: 69
      },
      {
        activity: TrainingType.Walking,
        caloriesBurned: 506.94,
        date: new Date("2024-12-09T06:30:12.830Z"),
        duration: 68
      },
      {
        activity: TrainingType.Swimming,
        caloriesBurned: 960,
        date: new Date("2024-12-09T20:12:23.984Z"),
        duration: 80
      },
      {
        activity: TrainingType.Walking,
        caloriesBurned: 398.58,
        date: new Date("2024-12-11T15:43:58.973Z"),
        duration: 52
      },
      {
        activity: TrainingType.Swimming,
        caloriesBurned: 742.1666666666666,
        date: new Date("2024-12-11T19:51:07.500Z"),
        duration: 61
      },
      {
        activity: TrainingType.Walking,
        caloriesBurned: 521.2199999999999,
        date: new Date("2024-12-14T08:44:49.681Z"),
        duration: 68
      }
    ],
    weight: 73
  },
  {
    activityLevel: 1.2,
    age: 42,
    avatar: "",
    email: "peter@yahoo.com",
    gender: Genders.Male,
    height: 173,
    id: "gT184YBXuqYxYAaSveqeZnScKB23",
    isAdmin: false,
    name: "Петрович",
    target: NutritionTarget.WeightMaintenance,
    token: "eyJhbGciOiJSUzI1NiIsImtpZCI6ImJkMGFlMTRkMjhkMTY1NzhiMzFjOGJlNmM4ZmRlZDM0ZDVlMWExYzEiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vbnV0cml0aW9uLTJjZGE3IiwiYXVkIjoibnV0cml0aW9uLTJjZGE3IiwiYXV0aF90aW1lIjoxNzMzNjc1OTk1LCJ1c2VyX2lkIjoiZ1QxODRZQlh1cVl4WUFhU3ZlcWVablNjS0IyMyIsInN1YiI6ImdUMTg0WUJYdXFZeFlBYVN2ZXFlWm5TY0tCMjMiLCJpYXQiOjE3MzM2NzU5OTUsImV4cCI6MTczMzY3OTU5NSwiZW1haWwiOiJwZXRlckB5YWhvby5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsicGV0ZXJAeWFob28uY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoicGFzc3dvcmQifX0.Vqwu6xciawUSUJ0vh6Uvc-2f0m3UCf9jiukMdH0maxtY8eD1f1S6DAtaOGinms679I5R1SQWL4yLXn-aKasM9Y_Pj4RvWuVzAyp7tWH4kqvFo2a0kjHmmOrYnlWQJpMvO3crM8MDAvLpB5Vv4hATVeOhvsRJEMK1dwR2JbYZZpJsWZVyyt0SIoz5Dpt4yP60B08yrUB7sxCrgTJ8N_H-BRpwUOsjreK98tBlG5DlgSetqT5gOfKBfyqq_ToONv5cs5pxovovZbX3e3hGOIuu2yXh3hy9U8EQdLW9vWlq9nT0bEDGUFfd_paS14PkQZ27jj_8uWHYj57F7ptWgOrUrw",
    weight: 94,
    mealSchedule: [],
    trainingSessions: []
  }
]
