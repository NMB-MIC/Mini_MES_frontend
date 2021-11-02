import React from "react";
import { shallow } from "enzyme";
import Bill_of_material from "./bill_of_material";

describe("Bill_of_material", () => {
  test("matches snapshot", () => {
    const wrapper = shallow(<Bill_of_material />);
    expect(wrapper).toMatchSnapshot();
  });
});
