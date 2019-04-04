class Api::InvitesController < ApplicationController
  before_action :authenticate_user
  before_action :set_event, only: [:create]
  before_action :set_user, only: [:create]
  before_action :set_invite, only: [:accept, :refuse]

  def create
    if @event === nil || @user === nil
      render status: 404
    else
      unless invite_already_exists(@user, @event) || user_in_event(@user, @event)
        if user_in_event(current_user, @event)
          invite = Invite.new()
          invite.user = @user
          invite.event = @event
          
          if invite.save
            render json: {invite: invite}, include: get_includes
          else
            render status: 422, json: invite.errors.messages
          end
        else
          render status: 401
        end
      else
        render status: 400
      end
    end
  end

  def index
    render json: {invites: current_user.invites}, include: [:event]
  end

  def accept
    if @invite === nil || @invite.user_id != current_user.id
      render status: 404
    else
      @invite.event.participants << current_user
      @invite.destroy
      render json: {success: true}
    end
  end

  def refuse
    if @invite === nil || @invite.user_id != current_user.id
      render status: 404
    else
      @invite.destroy
      render json: {success: true}
    end
  end

  private

  def get_includes
    [
        {user: {except: [:password_digest]}}
    ]
  end

  def user_in_event(user, event)
    event.participants.any? {|u| u.id === user.id}
  end

  def invite_already_exists(user, event)
    Invite.exists?(user_id: user.id, event_id: event.id)
  end

  def set_event
    @event = Event.includes(:participants).find_by(event_hash: params[:hash])
  end

  def set_user
    @user = User.find(params[:user_id])
  end

  def set_invite
    @invite = Invite.find(params[:id])
  end

end
