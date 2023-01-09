import React from "react";
import { Button, Form, Table } from "react-bootstrap";
import { useTable, usePagination, useRowSelect } from "react-table";
import { ImBlocked, ImFilePdf } from "react-icons/im";
import { MdDelete } from "react-icons/md";
import { CgUnblock } from "react-icons/cg";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import jsPDF from "jspdf";
import "jspdf-autotable";

import { SelectCheckbox } from "../components";
import { axiosFetch } from "../axios";
import { useTranslation } from "react-i18next";

const TableComponent = ({
  subject,
  columns,
  data,
  users,
  deleted,
  admins,
  refetch,
}) => {
  const { t } = useTranslation();
  const client = useQueryClient();

  const download = () => {
    const pdf = new jsPDF();
    pdf.autoTable({ html: "#table" });
    pdf.save(subject + ".pdf");
  };
  const blockOrUnblockMutation = useMutation(
    (body) => {
      return axiosFetch.put(
        `/admin/status?status=${body.status}`,
        { userIds: body.userIds },
        { withCredentials: true }
      );
    },
    {
      onSuccess: () => {
        client.invalidateQueries(["users"]);
        if (deleted) refetch();
      },
    }
  );
  const makeAdminOrNonAdminMutation = useMutation(
    (body) => {
      return axiosFetch.put(
        `/admin/role/?role=${body.role}`,
        { userIds: body.userIds },
        { withCredentials: true }
      );
    },
    {
      onSuccess: () => {
        client.invalidateQueries(["users"]);
        if (admins) {
          refetch();
        }
      },
    }
  );
  const {
    getTableProps,
    getTableBodyProps,
    page,
    prepareRow,
    headerGroups,
    state,
    pageOptions,
    nextPage,
    previousPage,
    canNextPage,
    gotoPage,
    canPreviousPage,
    selectedFlatRows,
  } = useTable(
    { columns, data: data || [] },
    usePagination,
    useRowSelect,
    (hooks) =>
      hooks.visibleColumns.push((columns) => {
        return [
          {
            id: "selection",
            Header: ({ getToggleAllRowsSelectedProps }) => (
              <SelectCheckbox {...getToggleAllRowsSelectedProps()} />
            ),
            Cell: ({ row }) => (
              <SelectCheckbox {...row.getToggleRowSelectedProps()} />
            ),
          },
          ...columns,
        ];
      })
  );
  const { pageIndex } = state;
  const userIds = selectedFlatRows.map((item) => item.original.id);
  return (
    <div className="d-flex flex-column">
      {users && (
        <div className="actions align-self-end d-flex align-items-center mb-2 d-flex gap-1">
          <Button
            onClick={() =>
              blockOrUnblockMutation.mutate({ userIds, status: "blocked" })
            }
          >
            <ImBlocked />
          </Button>
          <Button
            onClick={() =>
              blockOrUnblockMutation.mutate({ userIds, status: "active" })
            }
          >
            <CgUnblock />
          </Button>
          <Button
            onClick={() =>
              blockOrUnblockMutation.mutate({ userIds, status: "deleted" })
            }
            className="delete"
          >
            <MdDelete />
          </Button>
          <Button
            onClick={() =>
              makeAdminOrNonAdminMutation.mutate({ userIds, role: "admin" })
            }
            variant="success"
          >
            {t("make_admin")}
          </Button>
        </div>
      )}

      {deleted && (
        <div className="align-self-end mb-2">
          <Button
            onClick={() =>
              blockOrUnblockMutation.mutate({ userIds, status: "active" })
            }
          >
            {t("reactivate")}
          </Button>
        </div>
      )}
      {admins && (
        <div className="align-self-end mb-2">
          <Button
            onClick={() =>
              makeAdminOrNonAdminMutation.mutate({ userIds, role: "user" })
            }
            variant="success"
          >
            {t("make_nonadmin")}
          </Button>
        </div>
      )}

      <Table
        id="table"
        responsive
        bordered
        hovered="true"
        striped
        {...getTableProps()}
      >
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </Table>
      <div className="bottom">
        <div className="d-flex">
          <Button disabled={!canPreviousPage} onClick={() => previousPage()}>
            {t("previous")}
          </Button>
          <Form.Control
            type="number"
            defaultValue={1}
            onChange={(e) => {
              const pageIndex = +e.target.value - 1;
              gotoPage(pageIndex);
            }}
          />
          <Button disabled={!canNextPage} onClick={() => nextPage()}>
            {t("next")}
          </Button>
        </div>
        <p className="text-center mt-3">
          <strong>{pageIndex + 1}</strong> {t("of")} {pageOptions.length}
        </p>
        <Button
          disabled={!data?.length}
          onClick={download}
          className="d-flex gap-1"
          variant="link"
        >
          <ImFilePdf />
          {t("download")}
        </Button>
      </div>
    </div>
  );
};

export default TableComponent;
