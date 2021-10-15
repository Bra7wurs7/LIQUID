//Stolen from https://stackoverflow.com/users/2887218/jcalz https://stackoverflow.com/questions/54427218/parsing-complex-json-objects-with-inheritance

// a Serializable class has a no-arg constructor and an instance property
// named className
export type Serializable = new () => { readonly className: string }

// store a registry of Serializable classes
export const registry: Record<string, Serializable> = {};

// a decorator that adds classes to the registry
export function serializable<T extends Serializable>(constructor: T) {
  registry[(new constructor()).className] = constructor;
  return constructor;
}

// a custom JSON parser... if the parsed value has a className property
// and is in the registry, create a new instance of the class and copy
// the properties of the value into the new instance.
export const reviver = (k: string, v: any) =>
  ((typeof v === "object") && ("className" in v) && (v.className in registry)) ?
    Object.assign(new registry[v.className](), v) : v;
