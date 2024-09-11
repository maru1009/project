import React, {useState, useRef, useEffect} from "react";
import FruitList from "./FruitList";
import {v4 as uuidv4} from 'uuid'; 
const LOCAL_STORAGE_KEY = 'fruitApp.fruits'

function App() {
    const [fruits, setFruits] = useState([])
    const fruitNameRef = useRef()

    useEffect(() => { 
      const storedFruits = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY))
      if(storedFruits) {setFruits(storedFruits)}
    }, [])
    
    useEffect(() =>{ 
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(fruits))
    }, [fruits])





    function togglefruit(id){ 
      const newFruits = [...fruits]
      const fruit = newFruits.find(fruit => fruit.id === id)
      fruit.complete = !fruit.complete
      setFruits(newFruits)
    }

    function handleAddFruits(e){ 
      const name = fruitNameRef.current.value
      if(name === '') return
      setFruits(prevFruits => { 
        return [...prevFruits, {id: uuidv4(), name: name, complete: false}]
      })
      fruitNameRef.current.value = null
    }

    function handleClearFruits(){ 
      const newFruits = fruits.filter(fruit => !fruit.complete)
      setFruits(newFruits)
    }

    return(
      <>
        <FruitList fruits={fruits} togglefruit={togglefruit} />
        <input ref={fruitNameRef} type="text" />
        <button onClick={handleAddFruits}>Жагсаалт нэмэх</button>
        <button onClick={handleClearFruits}>Арилгах</button>
        <div>{fruits.filter(fruit => !fruit.complete).length} - ийг нэмсэн</div>
      </> 
    )
}

export default App;
