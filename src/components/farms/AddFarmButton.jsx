function AddFarmButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-8 right-8 bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-full shadow-lg"
    >
      + Add Farm
    </button>
  );
}

export default AddFarmButton;