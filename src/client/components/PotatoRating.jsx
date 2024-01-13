function PotatoRating({ value, onChange }) {
    const potatoes = [];
  
    for (let i = 1; i <= 5; i++) {
      potatoes.push(
        <img
          key={i}
          src="https://img.icons8.com/doodle/48/potato--v1.png"
          alt="Potato"
          className={`potato-image-rating ${i <= value ? 'selected' : ''}`}
          onClick={() => onChange(i)}
        />
      );
    }
  
    return <div>{potatoes}</div>;
}
export default PotatoRating
  