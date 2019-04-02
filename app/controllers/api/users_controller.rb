module Api
  class UsersController < ApplicationController
    before_action :authenticate_user, except: [:create]
    before_action :set_user, only: [:show]

    def create
      user_params = params.require(:user).permit(:username, :email, :password, :password_confirmation)
      user = User.new(user_params)
      already_exists = false
      errors = {
          username: false,
          email: false
      }

      if User.find_by(username: user.username) != nil
        already_exists = true
        errors[:username] = true
      end
      if User.find_by(email: user.email) != nil
        already_exists = true
        errors[:email] = true
      end

      if already_exists
        render status: 409, json: {errors: errors}
      else
        user.avatar_link = "https://avatars.dicebear.com/v2/gridy/#{user.username}.svg"
        if user.save
          render_json(user, true)
        else
          render status: 422, json: user.errors.messages
        end
      end
    end

    def show
      render_json(@user)
    end

    def current
      render_json(current_user, true)
    end

    def search
      unless params[:username].blank?
        users = User.where('username LIKE ? AND id <> ?', "#{params[:username]}%", current_user.id).limit(5)
        render json: {users: users}, except: [:password_digest]
      else
        render status: 400, json: {error: 'bad request'}
      end
    end

    private

    def set_user
      @user = User.find(params[:id])
    end

    def render_json(user, with_includes = false)
      includes = [{
          events: {
              include: [:chosen_place, :chosen_date]
          }
      }, invites: {
          include: [:event]
      }]

      if with_includes
        render json: {user: user}, include: includes, except: [:password_digest]
      else
        render json: {user: user}, except: [:password_digest]
      end
    end

  end
end
