import Style from "../style/dialogue_add_human.module.css";

export function AddChild({ setShowAddChild, detailsOfForm, nodesArrayList, currentHuman }) {
  const formData = {
    title: "Add child",
    form: [
      {
        title: "name",
        input: "Type name",
        type: "text",
        required: true,
      },
      {
        title: "Gender",
        select: "Select gender",
        option: [
          {
            value: "male",
          },
          {
            value: "female",
          },
        ],
        type: "select",
        required: true,
      },
      {
        title: currentHuman.gender !== "male" ? "Father" : "Mother",
        select: `Select the ${currentHuman.gender !== "male" ? "Father" : "Mother"} `,
        option: nodesArrayList
          .map(
            (v) => v.id !== currentHuman?.father?.id && v.id !== currentHuman?.id && v?.gender !== currentHuman?.gender && { value: v.name, id: v.id }
          )
          .filter((e) => e.value),

        type: "select",
        required: false,
      },
      {
        title: "Born",
        input: "Type the year of birth",
        type: "number",
        required: false,
      },
      {
        title: "Deceased",
        input: "Type the year of death",
        type: "number",
        required: false,
      },
      {
        title: "Details",
        textarea: "Type here your remarks",
        type: "text",
        required: false,
      },
    ],
  };

  return (
    <div className={Style.container}>
      <div className={Style.cover} onClick={() => setShowAddChild(!1)}></div>
      <div className={Style.content}>
        <h2>{formData.title}</h2>
        <form onSubmit={detailsOfForm} action="#">
          {formData.form.map((row, i) => (
            <div className={Style.row} key={i}>
              <div>
                <span>{row.title}</span>
              </div>
              <div>
                {row.input ? (
                  <input type={row.type} name={row.title} placeholder={row.input} required={row.required} autoFocus={i === 0 ? true : false} />
                ) : row.select ? (
                  <select name={row.title} required={row.required}>
                    <option defaultValue="DEFAULT">{row.select}</option>
                    {row.option.map((option, ind) => (
                      <option key={ind} value={option.id}>
                        {option.value}
                      </option>
                    ))}
                  </select>
                ) : (
                  <textarea name={row.title} rows="5" cols="10" placeholder={row.textarea} required={row.required}></textarea>
                )}
              </div>
            </div>
          ))}
          <div>
            <button type="submit" className={Style.save}>
              Save
            </button>
            <input type={"button"} className={Style.back} value="Back" onClick={() => setShowAddChild(!1)} />
          </div>
        </form>
      </div>
    </div>
  );
}

export function AddPartner({ setShowAddPartner, detailsOfForm }) {
  const formData = {
    title: "Add partner",
    form: [
      {
        title: "name",
        input: "Type name",
        type: "text",
        required: true,
      },
      {
        title: "Born",
        input: "Type the year of birth",
        type: "number",
        required: false,
      },
      {
        title: "Deceased",
        input: "Type the year of death",
        type: "number",
        required: false,
      },
      {
        title: "Details",
        textarea: "Type here your remarks",
        type: "text",
        required: false,
      },
    ],
  };

  return (
    <div className={Style.container}>
      <div className={Style.cover} onClick={() => setShowAddPartner(!1)}></div>
      <div className={Style.content}>
        <h2>{formData.title}</h2>
        <form onSubmit={detailsOfForm} action="#">
          {formData.form.map((row, i) => (
            <div className={Style.row} key={i}>
              <div>
                <span>{row.title}</span>
              </div>
              <div>
                {row.input ? (
                  <input name={row.title} type={row.type} placeholder={row.input} required={row.required} autoFocus={i === 0 ? true : false} />
                ) : (
                  <textarea name={row.title} rows="5" cols="10" placeholder={row.textarea} required={row.required}></textarea>
                )}
              </div>
            </div>
          ))}
          <div>
            <button type="submit" className={Style.save}>
              Save
            </button>
            <input type={"button"} className={Style.back} value="Back" onClick={() => setShowAddPartner(!1)} />
          </div>
        </form>
      </div>
    </div>
  );
}

export function WhichPartner({ detailsOfForm, setShowWhichPartner, ifCurrentHuman, nodesArrayList, currentHuman }) {
  return (
    <div className={Style.container}>
      <div className={Style.cover} onClick={() => setShowWhichPartner(!1)}></div>
      <div className={Style.content}>
        <h2>Which partner?</h2>
        <form onSubmit={detailsOfForm} action="#">
          <div className={Style.row}>
            <div>
              <select name="selectPartner" required>
                <option disabled value="DEFAULT">
                  Select partner
                </option>
                {nodesArrayList.map((v, ind) =>
                  v.id !== currentHuman?.father?.id && v.id !== currentHuman?.id && v?.gender !== currentHuman?.gender ? (
                    <option key={ind} value={v.id}>
                      {v.name}
                    </option>
                  ) : null
                )}
              </select>
            </div>
          </div>
          <div className={Style.row}>
            <div>
              <input type="button" value={"New partner"} onClick={() => ifCurrentHuman("addPartner")} />
            </div>
          </div>
          <div>
            <button type="submit" className={Style.save}>
              Save
            </button>
            <input type={"button"} className={Style.back} value="Back" onClick={() => setShowWhichPartner(!1)} />
          </div>
        </form>
      </div>
    </div>
  );
}
