// Este es el componente estandar para todas las tablas que se van a mostrar

import React from "react";

function Tablita({ columns, data }) {
  if (!data || data.length === 0) {
    return <p>No hay datos disponibles</p>;
  }

  return (
    <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%" }}>
      <thead>
        <tr>
          {columns.map((col, index) => (
            <th key={index}>{col.label}</th>
          ))}
        </tr>
      </thead>

      <tbody>
        {data.map((row, i) => (
          <tr key={i}>
            {columns.map((col, j) => (
              <td key={j}>{row[col.key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Tablita;