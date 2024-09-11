import React from "react";
import Fruit from './Fruit'; 

export default function FruitList({fruits, togglefruit}) { 
    return (
        fruits.map(fruit => {
            return <Fruit key={fruit.id} togglefruit={togglefruit} fruit={fruit} />
        })
    )
}
