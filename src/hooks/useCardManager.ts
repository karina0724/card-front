import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";

import { cardSchema } from "../schemas/cardSchema";
import type { CardData } from "../types/CardData";
import type { CardFormData } from "../types/CardFormData";

export const useCardManager = () => {
  const [cards, setCards] = useState<CardData[]>([]);
  const [filteredCards, setFilteredCards] = useState<CardData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<CardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CardFormData>({
    resolver: yupResolver(cardSchema),
  });

  const watchedNumber = watch("number", "");
  const watchedExpiry = watch("expiry", "");
  const watchedHolder = watch("holder", "");

  const formatCardNumber = (number: string) => number.replace(/(\d{4})(?=\d)/g, "$1 ");

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length >= 2) {
      value = value.substring(0, 2) + "/" + value.substring(2, 4);
    }
    setValue("expiry", value);
  };

  const filterCards = (value: string) => {
    if (!value.trim()) {
      setFilteredCards(cards);
    } else {
      const filtered = cards.filter(
        (card) =>
          card.holder.toLowerCase().includes(value.toLowerCase()) ||
          card.number.includes(value) ||
          card.expiry.includes(value)
      );
      setFilteredCards(filtered);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    filterCards(value);
  };

  const fetchCards = async () => {
    try {
      const res = await fetch("http://localhost:3000/cards");
      if (res.ok) {
        const data: CardData[] = await res.json();
        setCards(data);
        setFilteredCards(data);
      }
    } catch {
      toast.error("Error al cargar las tarjetas");
    }
  };

  const onSubmit = async (data: CardFormData) => {
    setLoading(true);
    try {
      const url = editingCard
        ? `http://localhost:3000/cards/${editingCard.id}`
        : "http://localhost:3000/cards";

      const method = editingCard ? "PUT" : "POST";

      const cleanData: CardFormData = {
        number: data.number.trim(),
        holder: data.holder.trim(),
        expiry: data.expiry.trim(),
        cvv: data.cvv.trim(),
      };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanData),
      });

      if (response.ok) {
        toast.success(editingCard ? "Tarjeta actualizada" : "Tarjeta agregada");
        reset();
        closeModal();
        fetchCards();
      } else {
        const err = await response.json();
        if (Array.isArray(err.errors)) err.errors.forEach((e: string) => toast.error(e));
        else toast.error(err.message || "Error al procesar la tarjeta");
      }
    } catch {
      toast.error("Error de conexión con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  const deleteCard = async (id: string) => {
    if (window.confirm("¿Eliminar esta tarjeta?")) {
      try {
        const response = await fetch(`http://localhost:3000/cards/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          toast.success("Tarjeta eliminada");
          fetchCards();
        } else {
          toast.error("Error al eliminar la tarjeta");
        }
      } catch {
        toast.error("Error de conexión");
      }
    }
  };

  const openAddModal = () => {
    setEditingCard(null);
    reset();
    setIsModalOpen(true);
  };

  const openEditModal = (card: CardData) => {
    setEditingCard(card);
    setValue("number", card.number);
    setValue("holder", card.holder);
    setValue("expiry", card.expiry);
    setValue("cvv", card.cvv);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    reset();
    setIsModalOpen(false);
    setEditingCard(null);
  };

  useEffect(() => {
    fetchCards();
  }, []);

  useEffect(() => {
    filterCards(searchTerm);
  }, [cards]);

  return {
    cards,
    filteredCards,
    searchTerm,
    isModalOpen,
    editingCard,
    loading,
    errors,
    watchedNumber,
    watchedExpiry,
    watchedHolder,
    register,
    handleSubmit,
    handleExpiryChange,
    handleSearchChange,
    onSubmit,
    deleteCard,
    openAddModal,
    openEditModal,
    closeModal,
    formatCardNumber,
  };
};
