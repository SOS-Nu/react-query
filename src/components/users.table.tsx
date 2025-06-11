import Table from "react-bootstrap/Table";
import { useState, forwardRef } from "react";
import Button from "react-bootstrap/Button";
import UserCreateModal from "./modal/user.create.modal";
import UserEditModal from "./modal/user.edit.modal";
import UserDeleteModal from "./modal/user.delete.modal";
import UsersPagination from "./pagination/users.pagination";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import { useQuery, keepPreviousData, useMutation } from "@tanstack/react-query";
import { Spinner } from "react-bootstrap";

interface IUser {
  id?: number;
  name: string;
  email: string;
}

function UsersTable() {
  const [isOpenCreateModal, setIsOpenCreateModal] = useState<boolean>(false);

  const [isOpenUpdateModal, setIsOpenUpdateModal] = useState<boolean>(false);
  const [dataUser, setDataUser] = useState({});

  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingDeleteIds, setLoadingDeleteIds] = useState<{
    [key: number]: boolean;
  }>({}); // Theo dõi loading cho từng ID
  const PAGE_SIZE = 9;

  const handleEditUser = (user: any) => {
    setDataUser(user);
    setIsOpenUpdateModal(true);
  };

  const handleDelete = (user: any) => {
    setDataUser(user);
    setIsOpenDeleteModal(true);
  };

  const PopoverComponent = forwardRef((props: any, ref: any) => {
    const { id } = props;
    const { isPending, error, data } = useQuery({
      queryKey: ["fetchUsers", id],
      queryFn: (): Promise<IUser> =>
        fetch(`http://localhost:8000/users/${id}`).then((res) => res.json()),
    });

    const getBody = () => {
      if (isPending) return "Loading detail...";
      if (error) return "An error has occurred: " + error.message;
      if (data) {
        return (
          <>
            <div>ID = {id}</div>
            <div>Name = {data.name}</div>
            <div>Email = {data.email}</div>
          </>
        );
      }
    };
    return (
      <Popover ref={ref} {...props}>
        <Popover.Header as="h3">Detail User</Popover.Header>
        <Popover.Body>{getBody()}</Popover.Body>
      </Popover>
    );
  });

  const {
    isPending,
    error,
    data: users,
  } = useQuery({
    queryKey: ["fetchUsers", currentPage],
    queryFn: (): Promise<IUser[]> =>
      fetch(
        `http://localhost:8000/users?_page=${currentPage}&_limit=${PAGE_SIZE}`
      ).then((res) => {
        const total_items = +(res.headers.get("X-Total-Count") ?? 0);

        const total_pages =
          total_items == 0 ? 1 : Math.ceil(total_items / PAGE_SIZE);
        setTotalPages(total_pages);
        return res.json();
      }),
    placeholderData: keepPreviousData,
  });

  if (isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          margin: "15px 0",
        }}
      >
        <h4>Table Users</h4>
        <Button
          variant="primary"
          onClick={() => setIsOpenCreateModal(true)}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
              <span> Add New</span>
            </>
          ) : (
            "Add New"
          )}
        </Button>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((users) => {
            return (
              <tr key={users.id}>
                <OverlayTrigger
                  trigger="click"
                  placement="right"
                  rootClose
                  overlay={<PopoverComponent id={users.id} />}
                >
                  <td>
                    <a href="#">{users.id}</a>
                  </td>
                </OverlayTrigger>

                <td>{users.name}</td>
                <td>{users.email}</td>
                <td>
                  <Button
                    variant="warning"
                    onClick={() => handleEditusers(users)}
                  >
                    Edit
                  </Button>
                  &nbsp;&nbsp;&nbsp;
                  {loadingDeleteIds[users?.id] ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        variant="danger"
                      />
                      <span> Delete</span>
                    </>
                  ) : (
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(users)}
                    >
                      Delete
                    </Button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      <UsersPagination
        totalPages={totalPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
      <UserCreateModal
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        isOpenCreateModal={isOpenCreateModal}
        setIsOpenCreateModal={setIsOpenCreateModal}
        currentPage={currentPage}
      />

      <UserEditModal
        isOpenUpdateModal={isOpenUpdateModal}
        setIsOpenUpdateModal={setIsOpenUpdateModal}
        dataUser={dataUser}
      />

      <UserDeleteModal
        setLoadingDeleteIds={setLoadingDeleteIds} // Truyền hàm để cập nhật loading
        loadingDeleteIds={loadingDeleteIds} // Truyền trạng thái loading
        dataUser={dataUser}
        isOpenDeleteModal={isOpenDeleteModal}
        setIsOpenDeleteModal={setIsOpenDeleteModal}
      />
    </>
  );
}

export default UsersTable;
