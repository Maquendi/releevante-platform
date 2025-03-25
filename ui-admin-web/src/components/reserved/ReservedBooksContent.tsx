"use client";

import MaxWithWrapper from "../MaxWithWrapper";
import NotReservedBooksFound from "./NotReservedBooksFound";
import RentItemsReview from "../RentItemsReview";
import PurchaseItemsReview from "../PurchaseItemsReview";
import Loading from "../Loading";
import useGetReservedBooks from "@/hooks/useGetReservedBooks";
import { CartItem } from "../Cartitem";
import SaveChangesBanner from "./SaveChangesBanner";
import useSaveModifyReservations from "@/hooks/useSavereservationBooks";

export default function ReservedBooksContent() {
  const {
    rentItems,
    purchaseItems,
    handleMoveBook,
    handleRemoveItem,
    modifiedBooks,
    isPending,
    handleResetModified,
    reservationId,
    handleClearModifyItems,
  } = useGetReservedBooks();
  const modifiedReservationMutation = useSaveModifyReservations();

  if (isPending) {
    return (
      <div className="grid place-content-center min-h-[50svh]">
        <Loading />
      </div>
    );
  }

  const handleSaveModifiedReservation = async () => {
    try {
      await modifiedReservationMutation.mutateAsync({
        items: modifiedBooks,
        reservationId: reservationId!,
      });
      handleClearModifyItems();
    } catch (error) {
      console.error("Error al guardar la reserva modificada:", error);
    }
  };

  return (
    <section>
      <MaxWithWrapper className="space-y-3 mt-7">
        <RentItemsReview isReservedBooks bookCount={rentItems?.length}>
          {rentItems.map((item) => {
            return (
              <CartItem
                key={item.id}
                item={item as any}
                itemType="RENT"
                moveItem={handleMoveBook}
                removeItem={handleRemoveItem}
              />
            );
          })}
        </RentItemsReview>
        <PurchaseItemsReview bookCount={purchaseItems?.length}>
          <>
            {purchaseItems.map((item) => {
              return (
                <CartItem
                  key={item.id}
                  item={item as any}
                  itemType="PURCHASE"
                  moveItem={handleMoveBook}
                  removeItem={handleRemoveItem}
                />
              );
            })}
          </>
        </PurchaseItemsReview>
        {!isPending && !rentItems?.length && !purchaseItems?.length ? (
          <NotReservedBooksFound />
        ) : null}
      </MaxWithWrapper>
      {modifiedBooks?.length && reservationId ? (
        <SaveChangesBanner
          resetChanges={handleResetModified}
          isLoading={modifiedReservationMutation.isPending}
          saveChanges={handleSaveModifiedReservation}
        />
      ) : null}
    </section>
  );
}
