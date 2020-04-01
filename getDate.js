function getDate() {
  const today = new Date();
  const currentDay = today.toLocaleDateString("en-us", {weekday: "long", day: "numeric", month: "long"});
  return currentDay
}

function getDay() {
  const today = new Date();
  const currentDay = today.toLocaleDateString("en-us", {weekday: "long"});
  return currentDay
}

module.exports = {
  getDate,
  getDay
};