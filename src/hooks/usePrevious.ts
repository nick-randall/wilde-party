import { useEffect, useRef } from "react";

export const usePrevious = <T>(value: any)=> {
  const ref: any = useRef<T>();
  useEffect(() => {
    ref.current = value;
  }, [value]); 

  return ref.current;
}
