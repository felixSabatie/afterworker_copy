# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2019_02_10_160012) do

  create_table "date_poll_options", force: :cascade do |t|
    t.datetime "date"
    t.integer "event_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["event_id"], name: "index_date_poll_options_on_event_id"
  end

  create_table "date_poll_options_users", id: false, force: :cascade do |t|
    t.integer "date_poll_option_id"
    t.integer "user_id"
    t.index ["date_poll_option_id", "user_id"], name: "unique_option_voter", unique: true
    t.index ["date_poll_option_id"], name: "index_date_poll_options_users_on_date_poll_option_id"
    t.index ["user_id"], name: "index_date_poll_options_users_on_user_id"
  end

  create_table "events", force: :cascade do |t|
    t.string "name"
    t.boolean "is_open_to_dates"
    t.boolean "is_open_to_places"
    t.string "event_hash"
    t.boolean "has_date_poll"
    t.boolean "has_place_poll"
    t.integer "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "date_poll_option_id"
    t.index ["date_poll_option_id"], name: "index_events_on_date_poll_option_id"
    t.index ["event_hash"], name: "index_events_on_event_hash", unique: true
    t.index ["user_id"], name: "index_events_on_user_id"
  end

  create_table "events_users", id: false, force: :cascade do |t|
    t.integer "event_id"
    t.integer "user_id"
    t.index ["event_id"], name: "index_events_users_on_event_id"
    t.index ["user_id"], name: "index_events_users_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "pseudo"
    t.string "email"
    t.string "password_digest"
    t.string "avatar_link"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["pseudo"], name: "index_users_on_pseudo", unique: true
  end

end
