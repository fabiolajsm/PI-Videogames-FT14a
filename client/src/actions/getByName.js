import axios from 'axios';
import { GET_BY_NAME } from './constants'


export const games = (videogames) => ({
    type: GET_BY_NAME,
    payload: videogames
})

export const getByName = (name) => {
    return (dispatch) => {
        return axios.get(`http://localhost:3001/videogames?name=${name}`)
            .then(videogames => {
                if (videogames.data === "Sorry! I dont have that videogame") return alert(`that videogame doesn't exist, try another!`)
                dispatch(games(videogames.data))
            })
    }
}