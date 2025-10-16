import { useState, useEffect } from "react";

function App() {
    const [medicaments, setMedicaments] = useState([]);
    const [nom, setNom] = useState("");
    const [dose, setDose] = useState("");
    const [heure, setHeure] = useState("");
    const [frequence, setFrequence]= useState("");
    const [email, setEmail] = useState(""); 

    useEffect(() => {
        fetch("http://127.0.0.1:5000/medicaments")
        .then(res => res.json())
        .then(data => setMedicaments(data))
    }, []);

    const addMedicament = () => {
        fetch("http://127.0.0.1:5000/medicaments" , {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nom,
                dose,
                heure,
                frequence,
                email
            })
        })
        .then(res => res.json())
        .then(data => {
            setMedicaments([...medicaments, data.data]);
            setNom("");
            setDose("");
            setHeure("");
            setFrequence("");
            setEmail("");
        });
    };

    return (
        <div style={{ padding: "20px", maxWidth: 500, margin: "auto"}}>
            <h1> Medical Remainder</h1>
            <input
            placeholder="Nom"
            value={nom}
            onChange={e => setNom(e.target.value)}
            style={{ margin: "5px", width: "100%"}}
            />
             <input
        placeholder="Dose"
        value={dose}
        onChange={e => setDose(e.target.value)}
        style={{ margin: "5px", width: "100%" }}
      />
      <input
        type="time"
        placeholder="Heure"
        value={heure}
        onChange={e => setHeure(e.target.value)}
        style={{ margin: "5px", width: "100%" }}
      />
      <input
        placeholder="Fréquence (ex: 2/j)"
        value={frequence}
        onChange={e => setFrequence(e.target.value)}
        style={{ margin: "5px", width: "100%" }}
      />
      <input
        placeholder="Votre email"
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={{ margin: "5px", width: "100%" }}
      />
      <button onClick={addMedicament} style={{ margin: "10px 0", width: "100%" }}>
        Ajouter
      </button>

      <ul>
        {medicaments.map((m, i) => (
          <li key={i}>
            <b>{m.nom}</b> - {m.dose} à {m.heure} ({m.frequence}) [{m.email}]
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

