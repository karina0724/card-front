import React from "react";
import { Plus, Search } from "lucide-react";

interface Props {
  searchTerm: string;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  openAddModal: () => void;
}

export const Toolbar = ({ searchTerm, handleSearchChange, openAddModal }: Props) => (
  <div className="toolbar">
    <div className="search-container">
      <Search size={20} className="search-icon" />
      <input
        type="text"
        placeholder="Buscar por nombre, número o fecha..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="search-input"
      />
    </div>
    <button className="btn btn-primary" onClick={openAddModal}>
      <Plus size={16} />
      Agregar Tarjeta
    </button>
  </div>
);
