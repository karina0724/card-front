"use client";

import { useCardManager } from "./hooks/useCardManager";
import { Header } from "./components/Header";
import { Toolbar } from "./components/Toolbar";
import { CardList } from "./components/CardList";
import { CardModal } from "./components/CardModal";
import { Toaster } from "sonner";
import "./App.css";

function App() {
  const cardManager = useCardManager();

  return (
    <div className="app">
      <div className="container">
        <Header />
        <Toolbar
          searchTerm={cardManager.searchTerm}
          handleSearchChange={cardManager.handleSearchChange}
          openAddModal={cardManager.openAddModal}
        />
        <CardList
          filteredCards={cardManager.filteredCards}
          searchTerm={cardManager.searchTerm}
          formatCardNumber={cardManager.formatCardNumber}
          openEditModal={cardManager.openEditModal}
          deleteCard={cardManager.deleteCard}
          openAddModal={cardManager.openAddModal}
        />
      </div>

      <CardModal
        isModalOpen={cardManager.isModalOpen}
        closeModal={cardManager.closeModal}
        editingCard={
          cardManager.editingCard
            ? {
                number: cardManager.editingCard.number,
                holder: cardManager.editingCard.holder,
                expiry: cardManager.editingCard.expiry,
                cvv: cardManager.editingCard.cvv,
              }
            : null
        }
        loading={cardManager.loading}
        watchedNumber={cardManager.watchedNumber}
        watchedHolder={cardManager.watchedHolder}
        watchedExpiry={cardManager.watchedExpiry}
        errors={cardManager.errors}
        register={cardManager.register}
        handleSubmit={cardManager.handleSubmit}
        onSubmit={cardManager.onSubmit}
        handleExpiryChange={cardManager.handleExpiryChange}
      />

      <Toaster position="top-right" />
    </div>
  );
}

export default App;
