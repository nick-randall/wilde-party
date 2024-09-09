import styled from "styled-components";

interface WidlePartyInputProps {
  name: string;
  value: string;
  onChange: (v: any) => void;
}

const Input = styled.div`
  // width: 300px;
  font-size: 25px;
  border-radius: 30px;
  box-shadow: 4px 5px 0px black;
  color: #f9ca44;
  border: thin black solid;
  padding: 7px 15px 7px 15px;
  background-color: white;
`;

const TextInput: React.FC<WidlePartyInputProps> = ({ name, value, onChange }) => {
  return (
    <Input>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        style={{
         all: "unset",
        }}
      />
    </Input>
  );
};

export default TextInput;