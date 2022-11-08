import Style from "../assets/style/main.module.css";

function Main({ generations }) {
  return (
    <main className={Style.main}>
      <table border={1} className={Style.table}>
        <thead>
          <tr>
            <th>שם</th>
            <th>לידה</th>
            <th>ב"ז</th>
            <th>נפטר (גיל)</th>
          </tr>
        </thead>
        {generations.map((human, i) => (
          <tbody key={i}>
            <tr>
              {/* {console.log(human)} */}
              <td>
                <b>{human.name}</b>
              </td>
              <td>{human.birthday || human.born || "-"}</td>
              {human.partner.length ? (
                <td>
                  {human.partner.map((par, i) => (
                    <span key={i}>
                      {par.name}
                      {human.partner.length - 1 > i ? ", " : ""}
                    </span>
                  ))}
                </td>
              ) : (
                <td>-</td>
              )}
              <td>{human.deceased || "-"}</td>
            </tr>
          </tbody>
        ))}
      </table>
    </main>
  );
}

export default Main;
