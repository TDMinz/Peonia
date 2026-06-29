import { useState } from 'react';

export default function useSelection<T extends string>() {
  const [selected, setSelected] = useState<T[]>([]);

  function toggle(value: T) {
    setSelected((prev) =>
      prev.includes(value)
        ? prev.filter((x) => x !== value)
        : [...prev, value]
    );
  }

  function toggleAll(values: T[]) {
    if (
      selected.length === values.length &&
      values.length > 0
    ) {
      setSelected([]);
    } else {
      setSelected(values);
    }
  }

  function clear() {
    setSelected([]);
  }

  function isSelected(value: T) {
    return selected.includes(value);
  }

  return {
    selected,
    toggle,
    toggleAll,
    clear,
    isSelected,
  };
}