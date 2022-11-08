import { useState } from "react";
import "./App.css";
import Style from "./assets/style/home.module.css";
import Main from "./components/Main";

import generations from "./generations.json";

function addBirthday(data) {
  data.forEach((human, i) => {
    const father = data.find((fat) => fat.id === human.parents?.fatherID);

    let birthday = father?.born && human.born ? human.born + father.birthday || father?.born : human.born;

    data[i]["birthday"] = birthday;
  });

  return data;
}

function App() {
  console.log(generations);
  const [data, setData] = useState(addBirthday(generations));

  return (
    <div className={Style.app}>
      <header>
        <h1>סדר הדורות</h1>
      </header>
      <Main generations={data} setData={setData} />
      <footer>@shmuel</footer>
    </div>
  );
}

export default App;
