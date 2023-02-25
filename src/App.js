import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import './App.css';

const ItemTypes = {
  CARD: 'card'
};

function Card({ id, text, index, moveCard }) {
  const ref = React.useRef(null);

  const [, drop] = useDrop({
    accept: ItemTypes.CARD,
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) {
        return;
      }
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      moveCard(dragIndex, hoverIndex);
      item.index = hoverIndex;
    }
  });

  const [{ isDragging }, drag] = useDrag({
    item: { type: ItemTypes.CARD, id, index },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  });

  const opacity = isDragging ? 0 : 1;

  drag(drop(ref));

  return (
    <div ref={ref} className="card" style={{ opacity }}>
      {text}
    </div>
  );
}

function App() {
  const [cards, setCards] = React.useState([
    { id: 1, text: 'Card 1' },
    { id: 2, text: 'Card 2' },
    { id: 3, text: 'Card 3' },
    { id: 4, text: 'Card 4' }
  ]);

  function moveCard(dragIndex, hoverIndex) {
    const dragCard = cards[dragIndex];
    setCards(
      update(cards, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragCard]
        ]
      })
    );
  }

  return (
    <div className="App">
      <div className="card-list">
        {cards.map((card, index) => (
          <Card
            key={card.id}
            id={card.id}
            text={card.text}
            index={index}
            moveCard={moveCard}
          />
        ))}
      </div>
    </div>
  );
}

function update(array, updateFunction) {
  const newArray = [...array];
  updateFunction(newArray);
  return newArray;
}

export default App;
