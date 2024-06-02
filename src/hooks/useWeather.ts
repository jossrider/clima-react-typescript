import axios from "axios"
import { z } from "zod"
import { SearchType } from "../types"
import { useMemo, useState } from "react"
// import { object, string, number, InferOutput, parse } from "valibot"

// TYPE GUARD O ASSERTION
// function isWWeatherResponse(weather: unknown): weather is Weather {
//   return (
//     Boolean(weather) &&
//     typeof weather === "object" &&
//     typeof (weather as Weather).name === "string" &&
//     typeof (weather as Weather).main.temp === "number" &&
//     typeof (weather as Weather).main.temp_max === "number" &&
//     typeof (weather as Weather).main.temp_min === "number"
//   )
// }

// Zod
const Weather = z.object({
  name: z.string(),
  main: z.object({
    temp: z.number(),
    temp_max: z.number(),
    temp_min: z.number(),
  }),
})

export type Weather = z.infer<typeof Weather>

// Valibot
// const WeatherSchema = object({
//   name: string(),
//   main: object({
//     temp: number(),
//     temp_max: number(),
//     temp_min: number(),
//   }),
// })

// type Weather = InferOutput<typeof WeatherSchema>

const initialState = {
  name: "",
  main: {
    temp: 0,
    temp_max: 0,
    temp_min: 0,
  },
}

export default function useWeather() {
  const [weather, setWeather] = useState<Weather>(initialState)
  const [loading, setLoading] = useState(false)
  const [notfound, setNotFound] = useState(false)

  const fetchWeather = async (search: SearchType) => {
    const appId = import.meta.env.VITE_API_KEY

    setWeather(initialState)
    setNotFound(false)
    setLoading(true)
    
    try {
      const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${search.city},${search.country}&appid=${appId}`
      const { data } = await axios(geoUrl)

      // Comprobar si existe
      if (!data[0]) {
        setNotFound(true)
        return
      }

      const lat = data[0].lat
      const lon = data[0].lon
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${appId}`

      // Castear el type
      // const { data: weatherResult } = await axios<Weather>(weatherUrl)

      // Type Guards
      // const { data: weatherResult } = await axios(weatherUrl)
      // const result = isWWeatherResponse(weatherResult)
      // if (result) {
      //   console.log(weatherResult.name)
      // }

      // Zod
      const { data: weatherResult } = await axios<Weather>(weatherUrl)
      const result = Weather.safeParse(weatherResult)
      if (result.success) {
        setWeather(result.data)
      }

      // Valibot
      // const { data: weatherResult } = await axios<Weather>(weatherUrl)
      // const result = parse(WeatherSchema, weatherResult)
      // if (result) {
      //   console.log(result.name)
      // } else {
      //   console.log("Respuesta mal formada..")
      // }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const hasWeatherData = useMemo(() => weather.name, [weather])

  return { weather, loading, notfound, fetchWeather, hasWeatherData }
}
