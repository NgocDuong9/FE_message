import { useState } from "react";

type IInit = {
  page?: number;
  limit?: number;
  order?: "ASC" | "DESC";
  search_string?: "";
  get_all?: boolean;
  fromDate?: Date | string;
  toDate?: Date | string;
};

export type IParams = {
  [key: string]: unknown;
  limit: number;
  page: number;
  order: "ASC" | "DESC";
};

function RemoveDataNull(data: IParams): IParams {
  Object.keys(data).forEach(
    (key) => (!data[key] || key === "filterMap") && delete data[key]
  );
  return data;
}

export const useSearchQuery = (init: IInit) => {
  const [date] = useState<Date>(() => {
    const curDate = new Date();
    curDate.setDate(curDate.getDate() + 1);
    return curDate;
  });

  const [params, setParams] = useState(() => {
    const data = {
      page: 1,
      limit: 30,
      ...init,
    } as IParams;
    return RemoveDataNull(data);
  });
  const paramsAll = {
    get_all: true,
  };

  const handleOnPage = (page: number) => {
    setParams((params) => RemoveDataNull({ ...params, page }));
  };

  const handleOnLimit = (limit: number) => {
    setParams((params) => RemoveDataNull({ ...params, limit, page: 1 }));
  };

  const handleOnOrder = (order: "ASC" | "DESC") => {
    setParams((params) => RemoveDataNull({ ...params, order }));
  };

  // const handleOnSearch = (search_string: string) => {
  //   _.delay(() => {
  //     setParams(params => RemoveDataNull({ ...params, search_string, page: 1 }))
  //   }, 500)
  // }

  // const handleOnFilter = (value: { [key: string]: unknown }) => {
  //   let filterMap = null
  //   if (init.filterMap) {
  //     filterMap = mappingData({ from: value, ...init.filterMap })
  //   } else {
  //     filterMap = value
  //   }

  //   setParams(params => {
  //     const newParams = { ...params, ...filterMap, page: 1 }
  //     return RemoveDataNull(newParams)
  //   })
  // }

  return {
    params,
    paramsAll,
    handleOnLimit,
    handleOnOrder,
    handleOnPage,
    // handleOnSearch,
    // handleOnFilter
  };
};
