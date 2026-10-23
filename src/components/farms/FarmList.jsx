import FarmCard from "./FarmCard";

function FarmList({ farms, onDelete, onEdit }) {
  return (
    <div className="grid md:grid-cols-2 gap-6">

      {farms.map((farm) => (
        <FarmCard
          key={farm.id}
          farm={farm}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}

    </div>
  );
}

export default FarmList;