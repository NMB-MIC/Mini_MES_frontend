import React from "react";
import { shallow } from "enzyme";
import Work_order_sheet from "./work_order_sheet";

describe("Work_order_sheet", () => {
  test("matches snapshot", () => {
    const wrapper = shallow(<Work_order_sheet />);
    expect(wrapper).toMatchSnapshot();
  });
});
