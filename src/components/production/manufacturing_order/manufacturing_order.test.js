import React from "react";
import { shallow } from "enzyme";
import Manufacturing_order from "./manufacturing_order";

describe("Manufacturing_order", () => {
  test("matches snapshot", () => {
    const wrapper = shallow(<Manufacturing_order />);
    expect(wrapper).toMatchSnapshot();
  });
});
