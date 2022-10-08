export interface BaseGroupProps<T> {
  /**
   * The attribute this input is for
   */
  attribute: string;
  /**
   * Render prop that will take all of data to render an input for the
   * attribute
   */
  children: (params: T) => JSX.Element;
}

export default BaseGroupProps;
