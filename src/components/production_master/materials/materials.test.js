import React from "react";
import { shallow } from "enzyme";
import Materials from "./materials";

describe("Materials", () => {
  test("matches snapshot", () => {
    const wrapper = shallow(<Materials />);
    expect(wrapper).toMatchSnapshot();
  });
});
