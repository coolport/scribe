// TYPESCRIPT REVIEW DONT MIND 
import { useState, type FormEvent, type ChangeEvent } from 'react'

//TODO:
//loading/error state
//prevent empty input / disable button on empty
//hit enter to search (done with form tags, but try to manually do it with key down)
//suggestions while typing
function Pokemon() {
  // prefer undefined for optional values (e.g. React props); use null only when modeling real "nothing" (like from APIs)
  const [query, setQuery] = useState<string>('');
  const [spriteUrl, setSpriteUrl] = useState<string | undefined>(undefined); //init as undefined not null (src prop expects it)

  const getPokemon = async (input: string): Promise<string | undefined> => { //change to undefined from null as well
    const url = `https://pokeapi.co/api/v2/pokemon/${input.toLowerCase()}/`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.log("Something went wrong.");
      }
      //check for errors first before parsing json from apis
      const parsed = await response.json();
      const sprite = parsed.sprites.front_default;
      console.log(sprite);
      return sprite;
    } catch (e) {
      console.error(e);
      return undefined;
    }
  }

  const handleClick = async (): Promise<void> => {
    setSpriteUrl(await getPokemon(query));
  }

  return (
    <>
      <div>
        <h3>TypeScript Pokemon Finder</h3>
        <div>
          <form
            onSubmit={(e: FormEvent<HTMLFormElement>): void => {
              e.preventDefault();
            }}
          >
            <input
              //ts infers the e type but whatever, inaccept lang code action here
              onChange={(e: ChangeEvent<HTMLInputElement>): void => {
                // e event object made by (onchange, onclick etc) .target - causer of event
                const val = e.target.value;
                setQuery(val)
                console.log(val);
              }
              }

            />
            <button onClick={handleClick}>Find</button>
          </form>
        </div>
        <div
          id='imageDiv'
        >
          {/* render img element only when spriteUrl exists */}
          {spriteUrl && <img src={spriteUrl} />}
        </div>
      </div>
    </>
  )
}

export default Pokemon
