class ApplicationController < ActionController::API
  include Knock::Authenticable

  rescue_from ActiveRecord::RecordNotFound do |exception|
    render json: 'Not found', status: 404
  end

end
