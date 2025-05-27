import React from "react";
import { CreditCard, X } from "lucide-react";
import type { UseFormRegister, FieldErrors, SubmitHandler } from "react-hook-form";
import type { CardFormData } from "../types/CardFormData";

interface Props {
  isModalOpen: boolean;
  closeModal: () => void;
  editingCard: CardFormData | null;
  loading: boolean;
  watchedNumber: string;
  watchedHolder: string;
  watchedExpiry: string;
  errors: FieldErrors<CardFormData>;
  register: UseFormRegister<CardFormData>;
  handleSubmit: (handler: SubmitHandler<CardFormData>) => (e?: React.BaseSyntheticEvent) => Promise<void>;
  onSubmit: SubmitHandler<CardFormData>;
  handleExpiryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CardModal = ({
  isModalOpen,
  closeModal,
  editingCard,
  loading,
  watchedNumber,
  watchedHolder,
  watchedExpiry,
  errors,
  register,
  handleSubmit,
  onSubmit,
  handleExpiryChange,
}: Props) => {
  if (!isModalOpen) return null;

  const formatCardNumber = (number: string) => number.replace(/(\d{4})(?=\d)/g, "$1 ");

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            <CreditCard size={20} />
            {editingCard ? "Editar Tarjeta" : "Agregar Nueva Tarjeta"}
          </h2>
          <button className="btn-close" onClick={closeModal}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="card-preview-container">
            <div className="credit-card-preview">
              <div className="card-header-preview">
                <div className="logo-section">
                  <div className="brand">monobank</div>
                  <div className="subtitle">Universal Bank</div>
                </div>
                <div className="contactless">
                  <div className="wave" />
                  <div className="wave" />
                  <div className="wave" />
                </div>
              </div>
              <div className="card-chip">
                <div className="chip" />
              </div>
              <div className="card-number">
                {formatCardNumber(watchedNumber) || "•••• •••• •••• ••••"}
              </div>
              <div className="card-bottom">
                <div className="card-holder">
                  <div className="label">TITULAR</div>
                  <div className="value">{watchedHolder || "NOMBRE DEL TITULAR"}</div>
                </div>
                <div className="card-expiry">
                  <div className="label">VENCE</div>
                  <div className="value">{watchedExpiry || "MM/YY"}</div>
                </div>
              </div>
              <div className="card-brand">
                <div className="mastercard">
                  <div className="circle red" />
                  <div className="circle yellow" />
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="modal-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="number">Número de Tarjeta</label>
                <input
                  id="number"
                  {...register("number")}
                  placeholder="1234567890123456"
                  maxLength={16}
                  className={`form-input ${errors.number ? "error" : ""}`}
                />
                {errors.number && <span className="error-message">{errors.number.message}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="expiry">Fecha Vencimiento</label>
                <input
                  id="expiry"
                  {...register("expiry")}
                  placeholder="MM/YY"
                  maxLength={5}
                  onChange={handleExpiryChange}
                  className={`form-input ${errors.expiry ? "error" : ""}`}
                />
                {errors.expiry && <span className="error-message">{errors.expiry.message}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="holder">Nombre Titular</label>
                <input
                  id="holder"
                  {...register("holder")}
                  placeholder="Juan Pérez"
                  maxLength={20}
                  className={`form-input ${errors.holder ? "error" : ""}`}
                />
                {errors.holder && <span className="error-message">{errors.holder.message}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="cvv">CVV</label>
                <input
                  id="cvv"
                  {...register("cvv")}
                  placeholder="123"
                  maxLength={4}
                  type="password"
                  className={`form-input ${errors.cvv ? "error" : ""}`}
                />
                {errors.cvv && <span className="error-message">{errors.cvv.message}</span>}
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" disabled={loading} className="btn btn-primary">
                {loading ? "Procesando..." : editingCard ? "Actualizar Tarjeta" : "Agregar Tarjeta"}
              </button>
              <button type="button" className="btn btn-secondary" onClick={closeModal}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
