declare module "react-slick" {
  import { Component } from "react";

  interface Settings {
    dots?: boolean;
    infinite?: boolean;
    speed?: number;
    slidesToShow?: number;
    slidesToScroll?: number;
    autoplay?: boolean;
    autoplaySpeed?: number;
    fade?: boolean;
    cssEase?: string;
    [key: string]: any;
  }

  class Slider extends Component<Settings> {}

  export default Slider;
}
