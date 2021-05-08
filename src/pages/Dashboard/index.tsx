import { useEffect, useState } from 'react';

import Header from '../../components/Header';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';

import { FoodsContainer } from './styles';

import api from '../../services/api';

interface FoodData {
  id: number;
  name: string;
  description: string;
  price: string;
  available: boolean;
  image: string
}

function Dashboard() {
  const [foods, setFoods] = useState<FoodData[]>();
  const [editingFood, setEditingFood] = useState<FoodData>();
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  function toggleModal() {
    setModalOpen(state => !state);
  }

  function toggleEditModal() {
    setEditModalOpen(state => !state);
  }

  function handleEditFood(food: FoodData) {
    setEditingFood(food);
    setEditModalOpen(true);
  }

  async function loadFoods() {
    const response = await api.get('/foods');

    setFoods(response.data);
  }

  async function handleAddFood(food: FoodData) {
    try {
      const response = await api.post<FoodData>('/foods', {
        ...food,
        available: true,
      });

      setFoods(state => [...state, response.data])
    } catch (err) {
      console.log(err)
    }
  }

  async function handleUpdateFood(food: FoodData) {
    try {
      const foodUpdated = await api.put(`/foods/${editingFood.id}`, {
        ...editingFood,
        ...food,
      });

      const foodsUpdated = foods.map(f => f.id !== foodUpdated.data.id
        ? f
        : foodUpdated.data
      );

      setFoods(foodsUpdated);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleDeleteFood(id: number) {
    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter(food => food.id !== id);

    setFoods(foodsFiltered);
  }

  useEffect(() => {
    loadFoods();
  }, [])

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
}

export default Dashboard;
