const defaultStages = [
  {
    id: 1,
    name: "Order Confirmed & Processing",
    description: "Kitchen has received and queued the order.",
    recommendedPercent: 5,
    icon: "📝",
  },
   {
    id: 2,
    name: "Meal Prep & Baking",
    description: "Cooking/assembly phase, longest stage.",
    recommendedPercent: 55,
    icon: "🧑‍🍳",
  },
   {
    id: 3,
    name: "Quality Check & Packaging",
    description: "Meal verified, packed, and sealed.",
    recommendedPercent: 5,
    icon: "📦",
  },
    {
    id: 4,
    name: "Rider Assigned & En Route",
    description: "Rider picked up and en route to customer.",
    recommendedPercent: 35,
    icon: "🛵",
  },
   {
    id: 5,
    name: "Delivered!",
    description: "Order delivered successfully.",
    recommendedPercent: 0,
    icon: "🎉",
  },
];

module.exports = { defaultStages };
