module Api
  class UsersController < ApplicationController
    def create
      user_params = params.require(:user).permit(:pseudo, :email, :password, :password_confirmation)
      user = User.new(user_params)
      already_exists = false
      errors = []

      if User.find_by(pseudo: user.pseudo) != nil
        already_exists = true
        errors << 'pseudo'
      end
      if User.find_by(email: user.email) != nil
        already_exists = true
        errors << 'email'
      end

      if already_exists
        render status: 409, json: {errors: errors}
      else
        if user.save
          render_json_with_includes(user)
        else
          render status: 422, json: user.errors.messages
        end
      end
    end

    private

    def render_json_with_includes(user)
      render json: {user: user}, include: [
          {
              events: {
                  include: [:chosen_place, :chosen_date]
              }
          }], except: [:password_digest]
    end

  end
end
