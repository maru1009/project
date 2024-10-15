import React from "react";

export default function Fruit({fruit, togglefruit}) { 
    function handleFruitClick() { 
        togglefruit(fruit.id)  // Correct function name
    }

    return (
        <div>
            <label>
                <input type="checkbox" checked={fruit.complete} onChange={handleFruitClick} />
                {fruit.name}
            </label>
        </div>
    )
}
