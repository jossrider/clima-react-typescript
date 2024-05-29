import { ChangeEvent, useState } from "react"
import type { SearchType } from "../../types"
import { countries } from "../../data/countries"
import styles from "./Form.module.css"

export default function Form() {
  const [search, setSearch] = useState<SearchType>({
    city: "",
    country: "",
  })
  const handleChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) => {
    setSearch({
      ...search,
      [e.target.name]: e.target.value,
    })
  }
  return (
    <form className={styles.form}>
      <div className={styles.field}>
        <label htmlFor="city">Ciudad: </label>
        <input
          type="text"
          id="city"
          name="city"
          placeholder="Ciudad"
          value={search.city}
          onChange={handleChange}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="country">Pais: </label>
        <select
          id="country"
          value={search.country}
          name="country"
          onChange={handleChange}>
          <option value="">-- Seleccione un Pais --</option>
          {countries.map((country) => (
            <option key={country.code} value={country.code}>
              {country.name}
            </option>
          ))}
        </select>
      </div>
      <input type="submit" value="Consultar Clima" className={styles.submit} />
    </form>
  )
}
