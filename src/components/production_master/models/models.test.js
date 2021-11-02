import React from "react";
import { shallow } from "enzyme";
import Models from "./models";

describe("Models", () => {
  test("matches snapshot", () => {
    const wrapper = shallow(<Models />);
    expect(wrapper).toMatchSnapshot();
  });
});
