import { useState, useEffect } from "react";

function App() {
  const [medicaments, setMedicaments] = useState([]);
  const [nom, setNom] = useState("");
  const [dose, setDose] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:5000/medicaments")
      .then(res => res.json())
      .then(data => setMedicaments(data));
  }, []);

  const addMedicament = () => {
    fetch("http://127.0.0.1:5000/medicaments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nom, dose })
    })
      .then(res => res.json())
      .then(data => {
        setMedicaments([...medicaments, data.data]);
        setNom("");
        setDose("");
      });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>💊 Suivi Médicaments</h1>
      <input placeholder="Nom" value={nom} onChange={e => setNom(e.target.value)} />
      <input placeholder="Dose" value={dose} onChange={e => setDose(e.target.value)} />
      <button onClick={addMedicament}>Ajouter</button>

      <ul>
        {medicaments.map((m, i) => (
          <li key={i}>{m.nom} - {m.dose}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
