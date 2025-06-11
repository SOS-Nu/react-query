import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import { QUERY_KEY } from "../../config/key";

const UserDeleteModal = (props: any) => {
  const {
    dataUser,
    isOpenDeleteModal,
    setIsOpenDeleteModal,
    setLoadingDeleteIds,
  } = props;
  const queryClient = useQueryClient();
  useEffect(() => {});

  const mutation = useMutation({
    mutationFn: async (payload: { id: number }) => {
      const res = await fetch(`http://localhost:8000/users/${payload.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": " application/json",
        },
      });
      return res.json();
    },
    onSuccess: (data, variables, context) => {
      // Boom baby!
      toast("🦄 Wow so easy! delete user");
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY.getAllUser(),
      });
    },
  });

  const handleSubmit = () => {
    console.log({ id: dataUser?.id });
    mutation.mutate({ id: dataUser?.id });
    setLoadingDeleteIds((prev: any) => ({ ...prev, [dataUser.id]: true })); // Bật loading cho user cụ thể
    setIsOpenDeleteModal(false);
  };

  return (
    <Modal
      show={isOpenDeleteModal}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      backdrop={false}
      onHide={() => setIsOpenDeleteModal(false)}
    >
      <Modal.Header closeButton>
        <Modal.Title>Delete A User</Modal.Title>
      </Modal.Header>
      <Modal.Body>Delete the user: {dataUser?.email ?? ""}</Modal.Body>
      <Modal.Footer>
        <Button
          variant="warning"
          onClick={() => setIsOpenDeleteModal(false)}
          className="mr-2"
        >
          Cancel
        </Button>
        <Button onClick={() => handleSubmit()}>Confirm</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UserDeleteModal;
