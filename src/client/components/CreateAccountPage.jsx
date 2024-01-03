//this component displays the form for a user to create an account
//TODO: still need to actually implement the register api post ma bobber
function CreateAccountPage() {
  return (
    <div>
      <h2>Create Account</h2>
      <form>
        <label>
          Username:
          <input type="text" />
        </label>
        <br />
        <label>
          Password:
          <input type="password" />
        </label>
        <br />
        <label>
          Email:
          <input type="email" />
        </label>
        <br />
        <button type="submit">Create Account</button>
      </form>
    </div>
  );
}

export default CreateAccountPage;
