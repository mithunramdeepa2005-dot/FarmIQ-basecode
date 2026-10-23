import { Bell } from "lucide-react";

function ReminderCard() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">

      <div className="flex justify-between">

        <div>

          <p className="text-gray-500">
            Next Reminder
          </p>

          <h2 className="text-2xl font-bold mt-2">
            Water Crop
          </h2>

          <p className="text-gray-500 mt-2">
            Today • 6:00 PM
          </p>

        </div>

        <Bell
          size={50}
          className="text-red-500"
        />

      </div>

    </div>
  );
}

export default ReminderCard;