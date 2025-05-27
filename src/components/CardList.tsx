import type { CardData } from "../types/CardData";
import { Edit, Trash2, CreditCard, Plus } from "lucide-react";

interface Props {
  filteredCards: CardData[];
  searchTerm: string;
  formatCardNumber: (number: string) => string;
  openEditModal: (card: CardData) => void;
  deleteCard: (id: string) => void;
  openAddModal: () => void;
}

export const CardList = ({
  filteredCards,
  searchTerm,
  formatCardNumber,
  openEditModal,
  deleteCard,
  openAddModal,
}: Props) => {
  if (filteredCards.length === 0) {
    return (
      <div className="empty-state">
        <CreditCard size={64} className="empty-icon" />
        <h3>{searchTerm ? "No se encontraron tarjetas" : "No hay tarjetas registradas"}</h3>
        <p>
          {searchTerm
            ? "Intenta con otros términos de búsqueda"
            : "Comienza agregando tu primera tarjeta de crédito"}
        </p>
        {!searchTerm && (
          <button className="btn btn-primary" onClick={openAddModal}>
            <Plus size={16} />
            Agregar Tarjeta
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="cards-grid">
      {filteredCards.map((card) => (
        <div key={card.id} className="card-item">
          <div className="card-mini">
            <div className="card-mini-header">
              <span className="card-brand-text">monobank</span>
            </div>
            <div className="card-mini-number">{formatCardNumber(card.number)}</div>
            <div className="card-mini-info">
              <div className="card-mini-holder">
                <div className="label">TITULAR</div>
                <div className="value">{card.holder}</div>
              </div>
              <div className="card-mini-expiry">
                <div className="label">VENCE</div>
                <div className="value">{card.expiry}</div>
              </div>
            </div>
          </div>
          <div className="card-actions">
            <button className="btn btn-outline" onClick={() => openEditModal(card)}>
              <Edit size={16} />
              Editar
            </button>
            <button className="btn btn-danger" onClick={() => deleteCard(card.id!)}>
              <Trash2 size={16} />
              Eliminar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
