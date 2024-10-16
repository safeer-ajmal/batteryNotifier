const notifier = require("node-notifier");
const si = require("systeminformation");

let lastNotifiedLevel = null;

const checkBattery = () => {
  si.battery()
    .then((data) => {
      const batteryLevel = data.percent;
      const isPlugged = data.isCharging; // Update the charging status

      console.log(`Current battery level: ${batteryLevel}%`);
      console.log(`Is charging: ${isPlugged}`);
      console.log(`last is: ${lastNotifiedLevel}`);

      // Notify for 80% when plugged in
      if (isPlugged && batteryLevel >= 80 && lastNotifiedLevel !== 80) {
        notifier.notify({
          title: "Battery Alert",
          message: "Battery level is at 80%. Consider unplugging your charger.",
          sound: true,
        });
        lastNotifiedLevel = 80; // Update last notified level
      } else if (!isPlugged) {
        // Notify for 35% when not plugged in
        if (batteryLevel <= 35 && lastNotifiedLevel !== 35) {
          notifier.notify({
            title: "Battery Alert",
            message:
              "Battery level is at " +
              batteryLevel +
              "%. Consider charging your laptop.",
            sound: true,
          });
          lastNotifiedLevel = 35; // Update last notified level
        }
      }
    })
    .catch((error) => console.error(`Error getting battery status: ${error}`));
};

// Check battery every minute (60000 ms)
setInterval(checkBattery, 10000); // Adjusted for 1 minute
