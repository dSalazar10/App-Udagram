/* MIT License
Copyright (c) 2019 Daniel Salazar
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
import {add, divide} from "./units";
import {expect} from "chai";
import "mocha";

describe("add function", () => {

  it("should add two and two", () => {
    const result = add(2, 2);
    expect(result).to.equal(4);
  });

  it("should add -2 and two", () => {
    const result = add(-2, 2);
    expect(result).to.equal(0);
  });

});

describe("divide", () => {

  it("should divide 6 by 3", () => {
    const result = divide(6, 3);
    expect(result).to.equal(2);
  });

  it("should divide 5 and 2", () => {
    const result = divide(5, 2);
    expect(result).to.equal(2.5);
  });

  it("should throw an error if div by zero", () => {
    expect(() => { divide(5, 0); }).to.throw("div by 0");
  });

});

// @TODO try creating a new describe block for the "concat" method
// it should contain an it block for each it statement in the units.ts @TODO.
// don't forget to import the method ;)
